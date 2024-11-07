FROM python:3.9-bullseye

WORKDIR /opt/app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the Flask port (default is 5000)
EXPOSE 5000

# Set environment variables
ENV FLASK_ENV=development
ENV PYTHONUNBUFFERED=1  

# Use Gunicorn to serve the Flask app
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "--reload" "main:app"]
