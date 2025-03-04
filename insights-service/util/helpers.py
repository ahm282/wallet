from sqlalchemy.inspection import inspect


def model_to_dict(model_instance) -> dict:
    """
    Convert a SQLAlchemy model instance to a dictionary.
    """
    return {
        c.key: getattr(model_instance, c.key)
        for c in inspect(model_instance).mapper.column_attrs
    }


def getUnixTime() -> int:
    """
    Get current Unix time in milliseconds.
    """
    import time

    return int(time.time() * 1000)
