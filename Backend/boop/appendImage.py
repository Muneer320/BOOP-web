from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.graphics import renderPDF
from pypdf import PdfReader, PdfWriter
from svglib.svglib import svg2rlg
import os
import re
import tempfile


def append_page(book_name, image_path):
    pdf_filename = f"{book_name}.pdf"

    page_width, page_height = A4

    if os.path.exists(pdf_filename):
        existing_pdf = PdfReader(pdf_filename)
        output = PdfWriter()

        for page_num in range(len(existing_pdf.pages)):
            output.add_page(existing_pdf.pages[page_num])

        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            temp_page = tmp.name

        packet = canvas.Canvas(temp_page, pagesize=A4)
        packet.drawImage(image_path, 0, 0, width=page_width,
                         height=page_height)
        packet.save()

        new_page = PdfReader(temp_page)
        output.add_page(new_page.pages[0])

        with open(pdf_filename, "wb") as output_stream:
            output.write(output_stream)

        os.unlink(temp_page)

    else:
        c = canvas.Canvas(pdf_filename, pagesize=A4)
        c.drawImage(image_path, 0, 0, width=page_width, height=page_height)
        c.showPage()
        c.save()


def append_puzzle_page(pdf_file, svg_directory, background_image=None, prog_callback=None):
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        temp_pdf = tmp.name
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        new_pdf = tmp.name
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        new_solutions_pdf = tmp.name

    if os.path.exists(pdf_file):
        with open(pdf_file, "rb") as f:
            existing_pdf = PdfReader(f)
            pdf_writer = PdfWriter()
            for page_num in range(len(existing_pdf.pages)):
                pdf_writer.add_page(existing_pdf.pages[page_num])
            with open(temp_pdf, "wb") as f_temp:
                pdf_writer.write(f_temp)

    c = canvas.Canvas(new_pdf, pagesize=A4)
    c_solutions = canvas.Canvas(new_solutions_pdf, pagesize=A4)
    width, height = A4
    top_margin = 100
    bottom_margin = 100

    svg_files = sorted(
        f for f in os.listdir(svg_directory)
        if f.endswith(".svg") and not f.endswith("S.svg")
    )
    total_svgs = len(svg_files)

    if prog_callback:
        prog_callback("render_solutions", "Rendering solutions cover\u2026")
    if background_image:
        c_solutions.drawImage(background_image, 0, 0,
                              width=width, height=height)
    solutions_cover = os.path.join(svg_directory, "S.svg")
    if os.path.exists(solutions_cover):
        cover_drawing = svg2rlg(solutions_cover)
        cover_width = cover_drawing.width
        cover_height = cover_drawing.height
        scale_cover_width = width / cover_width
        scale_cover_height = height / cover_height
        scale_cover = min(scale_cover_width, scale_cover_height)

        cover_drawing.scale(scale_cover, scale_cover)
        renderPDF.draw(cover_drawing, c_solutions, 0, 0)
        c_solutions.showPage()
    else:
        c_solutions.setFont("Helvetica-Bold", 48)
        solutions_text = "SOLUTIONS"
        c_solutions.drawString(
            (width - c_solutions.stringWidth(solutions_text)) / 2, height / 2, solutions_text)
        c_solutions.showPage()

    def extract_order_number(filename):
        match = re.match(r"(\d+)", filename)
        return int(match.group(1)) if match else float('inf')

    solutions_per_line = 2
    max_lines_per_page = 3
    y_position = height - top_margin - 150
    solution_page_num = 0
    puzzle_count = 0
    for svg_filename in sorted(os.listdir(svg_directory), key=extract_order_number):
        if svg_filename.endswith("S.svg") or not svg_filename.endswith(".svg"):
            continue

        if prog_callback:
            prog_callback("render_puzzles", f"Puzzle page {puzzle_count + 1}/{total_svgs}")

        svg_filepath = os.path.join(svg_directory, svg_filename)
        drawing = svg2rlg(svg_filepath)

        if background_image:
            c.drawImage(background_image, 0, 0, width=width, height=height)

        drawing_width = drawing.width
        drawing_height = drawing.height
        scale_width = width / drawing_width
        scale_height = height / drawing_height
        scale = min(scale_width, scale_height)

        drawing.scale(scale, scale)
        renderPDF.draw(drawing, c, (width - drawing_width * scale) /
                       2, (height - drawing_height * scale) / 2)

        c.showPage()

        solution_filename = svg_filename.replace(".svg", "S.svg")
        solution_filepath = os.path.join(svg_directory, solution_filename)
        if os.path.exists(solution_filepath):
            solution_drawing = svg2rlg(solution_filepath)

            if solution_page_num == 0 and background_image:
                c_solutions.drawImage(
                    background_image, 0, 0, width=width, height=height)

            if solution_drawing:
                solution_width = solution_drawing.width
                solution_height = solution_drawing.height
                scale_solution_width = (width / 2 - 50) / solution_width
                scale_solution_height = (height - top_margin - bottom_margin) / (
                    max_lines_per_page + 1) / solution_height
                scale_solution = min(scale_solution_width,
                                     scale_solution_height) * 1.2

                if solution_height * scale_solution + y_position < bottom_margin:
                    c_solutions.showPage()
                    if background_image:
                        c_solutions.drawImage(
                            background_image, 0, 0, width=width, height=height)
                    y_position = height - top_margin - 150

                x_position = (width / 2 - solution_width * scale_solution) / 2 + (solution_page_num %
                                                                                  solutions_per_line) * (width / 2)

                c_solutions.saveState()
                c_solutions.translate(x_position, y_position)
                c_solutions.scale(scale_solution, scale_solution)
                renderPDF.draw(solution_drawing, c_solutions, 0, 0)
                c_solutions.restoreState()

                c_solutions.setFont("Helvetica", 12)
                solution_name = os.path.basename(solution_filepath).split(".")[
                    1].replace("S", "")
                text_width = c_solutions.stringWidth(
                    solution_name, "Helvetica", 12)
                c_solutions.drawString(
                    x_position + (solution_width * scale_solution - text_width) / 2, y_position - 20, solution_name)

                if solution_page_num % solutions_per_line == (solutions_per_line - 1):
                    y_position -= (solution_height * scale_solution + 50)
                    if solution_page_num % (solutions_per_line * max_lines_per_page) == (solutions_per_line * max_lines_per_page - 1):
                        c_solutions.showPage()
                        if background_image:
                            c_solutions.drawImage(
                                background_image, 0, 0, width=width, height=height)
                        y_position = height - top_margin - 150

                solution_page_num += 1

        puzzle_count += 1

    c_solutions.save()
    c.save()

    if prog_callback:
        prog_callback("merge_pdfs", "Merging PDF pages\u2026")

    if os.path.exists(pdf_file):
        with open(temp_pdf, "rb") as f_existing, open(new_pdf, "rb") as f_new, open(new_solutions_pdf, "rb") as f_solutions:
            existing_pdf = PdfReader(f_existing)
            new_pdf_content = PdfReader(f_new)
            solutions_pdf_content = PdfReader(f_solutions)
            pdf_writer = PdfWriter()

            with open(pdf_file, "wb") as f_final:
                for page in existing_pdf.pages:
                    pdf_writer.add_page(page)
                for page in new_pdf_content.pages:
                    pdf_writer.add_page(page)
                for page in solutions_pdf_content.pages:
                    pdf_writer.add_page(page)
                pdf_writer.write(f_final)

    for f in [temp_pdf, new_pdf, new_solutions_pdf]:
        try:
            os.unlink(f)
        except OSError:
            pass
