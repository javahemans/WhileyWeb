FROM ubuntu:16.04

# Update image and install git
RUN apt-get update -y && apt-get install -y \
    git \
    openjdk-8-jdk \
    python

# Copy repository data from here
CMD mkdir /home/whileyweb
COPY . /home/whileyweb/

# Set the working directory
WORKDIR /home/whileyweb/
# Set the default command
CMD ["./launcher.cgi"]

# Expose port
EXPOSE 8080