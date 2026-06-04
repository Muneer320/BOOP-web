import os
import json
import random


def word_to_json(file_path="Words/words.txt", num_normal=10, num_hard=5, bonus_normal=1, bonus_hard=1, output_path=None):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Error: File '{file_path}' does not exist.")

    with open(file_path, 'r') as file:
        data = file.read()

    sections = data.split('====================')
    result = {}

    for section in sections:
        if not section.strip():
            continue
        lines = section.strip().splitlines()
        topic = lines[0].strip('>').strip()
        words = [word.strip() for word in lines[1:] if word.strip()]

        normal_pool = {w for w in words if 4 <= len(w) <= 11}
        hard_pool = {w for w in words if 6 <= len(w) <= 15}

        def _sample(pool, count, result_list):
            sample = random.sample(list(pool), count)
            pool.difference_update(sample)
            result_list.append(sample)
            return pool, result_list

        normal_needed = num_normal + bonus_normal
        hard_needed = num_hard + bonus_hard

        if normal_needed > 0:
            if len(normal_pool) < normal_needed:
                raise ValueError(f"Topic '{topic}' has only {len(normal_pool)} normal-length words (4-11 letters), needs at least {normal_needed} for {normal_needed} puzzle(s).")
            normal_w_count = max(1, min(10, len(normal_pool) // normal_needed))
        else:
            normal_w_count = 10

        if hard_needed > 0:
            if len(hard_pool) < hard_needed:
                raise ValueError(f"Topic '{topic}' has only {len(hard_pool)} hard-length words (6-15 letters), needs at least {hard_needed} for {hard_needed} puzzle(s).")
            hard_w_count = max(1, min(15, len(hard_pool) // hard_needed))
        else:
            hard_w_count = 15

        topic_result = {"Normal": [], "Hard": [], "Bonus": {"Normal": [], "Hard": []}}
        for _ in range(num_normal):
            normal_pool, topic_result["Normal"] = _sample(normal_pool, normal_w_count, topic_result["Normal"])
        for _ in range(num_hard):
            hard_pool, topic_result["Hard"] = _sample(hard_pool, hard_w_count, topic_result["Hard"])
        for _ in range(bonus_normal):
            normal_pool, topic_result["Bonus"]["Normal"] = _sample(normal_pool, normal_w_count, topic_result["Bonus"]["Normal"])
        for _ in range(bonus_hard):
            hard_pool, topic_result["Bonus"]["Hard"] = _sample(hard_pool, hard_w_count, topic_result["Bonus"]["Hard"])

        result[topic] = topic_result

    if output_path is None:
        output_path = os.path.join(os.path.dirname(__file__), "Words", "words.json")
    with open(output_path, "w") as f:
        json.dump(result, f, indent=4)


if __name__ == '__main__':
    word_to_json("Words/words.txt", num_normal=10, num_hard=5, bonus_normal=1, bonus_hard=1)
