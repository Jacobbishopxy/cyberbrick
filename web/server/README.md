# Use case

dev:

    ```sh
    go run main.go -a http://localhost:7999 -g http://localhost:8080
    ```

prod:

    ```sh
    go build
    ./cyberbrick-web-server -a http://localhost:7999 -g http://localhost:8080
    ```
