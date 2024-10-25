# Use an official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /src

# Copy the requirements.txt file into the working directory
COPY requirements.txt .

# Install the dependencies, can use without --no-cache-dir, but will make image size bigger, not sure what is best?
RUN pip install --no-cache-dir -r requirements.txt 

# Copy the rest of the application code
COPY . .

# Set a default command to run your application (if applicable)
CMD ["python", "/src/python/cleaner.py"]
