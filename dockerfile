# slim version for portability
FROM python:3.12-slim

# needed for 'sounddevice' library
RUN apt-get update && \
    apt-get install -y portaudio19-dev

WORKDIR /app

COPY . /app

# get requirements from 'requirements.txt'
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

# to enable automatic updating of all files
ENV FLASK_ENV=development

# run using flask
CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]