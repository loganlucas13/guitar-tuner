# slim version for portability
FROM python:3.12-slim

# needed for 'sounddevice' library
RUN apt-get update && \
    apt-get install -y portaudio19-dev

WORKDIR /app

COPY . /app

# get requirements from 'requirements.txt'
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "src/application.py"]