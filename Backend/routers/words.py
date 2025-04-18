from fastapi import APIRouter, HTTPException
import os

router = APIRouter()

# Path to raw words file
data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'boop', 'Words'))
raw_file = os.path.join(data_dir, 'words.txt')


def _parse_raw():
    if not os.path.exists(raw_file):
        return {}
    with open(raw_file, 'r', encoding='utf-8') as f:
        sections = f.read().split('====================')
    topics = {}
    for sec in sections:
        lines = [ln.strip() for ln in sec.strip().splitlines() if ln.strip()]
        if not lines:
            continue
        topic = lines[0].lstrip('>').strip()
        words = [w for w in lines[1:]]
        topics[topic] = words
    return topics

@router.get('/topics')
def list_topics():
    """List all available topics from the raw words file"""
    topics = list(_parse_raw().keys())
    return {'topics': topics}

@router.get('/topics/{topic}/words')
def get_topic_words(topic: str):
    """Get word list for a specific topic"""
    topics = _parse_raw()
    if topic not in topics:
        raise HTTPException(status_code=404, detail='Topic not found')
    return {'topic': topic, 'words': topics[topic]}
