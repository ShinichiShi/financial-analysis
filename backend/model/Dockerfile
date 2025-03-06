# Use the official Python image
FROM python:3.10

# Set the working directory inside the container
WORKDIR /app

# Copy only the backend folder contents
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port for FastAPI
EXPOSE 8000

# Start FastAPI with Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
