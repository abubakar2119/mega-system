mage vs. Container: An image is a blueprint containing all the code and dependencies, while a container is the active, running environment created from that image.

Why Docker: Containerizing services avoids version conflicts and prevents "works on my machine" bugs by guaranteeing the exact same setup across all environments.

Volumes & Commands: A Docker volume keeps your database data safe from deletion; docker compose down stops containers while preserving this data, whereas docker compose down -v permanently deletes both the containers and their volumes.