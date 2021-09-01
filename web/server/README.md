# Use case

dev:

    ```sh
    go run main.go -a http://localhost:8030 -g http://localhost:8010
    ```

prod:

    ```sh
    go build
    ./cyberbrick-web-server -a http://localhost:8030 -g http://localhost:8010
    ```
