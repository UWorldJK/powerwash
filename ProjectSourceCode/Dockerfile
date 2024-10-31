FROM python:3.9-bullseye

WORKDIR /opt/app

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY . .

# Expose the Flask port (default is 5000)
EXPOSE 5000
    
# Define environment variables, if needed
ENV FLASK_ENV=development
    
# Command to run the Flask app
CMD ["python", "main.py"]