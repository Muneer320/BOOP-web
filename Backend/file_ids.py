import os
import re

# Uploaded files are stored as "<uuid4>" plus the original extension, if any.
FILE_ID_RE = re.compile(r'^[a-f0-9\-]{36}(\.[a-zA-Z0-9]{1,10})?$')


def is_safe_file_id(file_id):
    """True for an empty value or a bare upload id; rejects paths and traversal."""
    if not file_id:
        return True
    basename = os.path.basename(file_id)
    return basename == file_id and bool(FILE_ID_RE.match(file_id))
