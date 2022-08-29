# FamPay Backend Engineering - Anjan Nair

## Project Goal

To make an API to fetch latest videos sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.

## Basic Requirements:

- [x] Server should call the YouTube API continuously in background (async) with some interval (say 10 seconds) for fetching the latest videos for a predefined search query and should store the data of videos (specifically these fields - Video title, description, publishing datetime, thumbnails URLs and any other fields you require) in a database with proper indexes.

Solution - In every 1 minute the API fetches the YouTube API and gets stores it in the database. The code for the background call can be found in `app.js`.

- [x] A GET API which returns the stored video data in a paginated response sorted in descending order of published datetime.

Solution - Send a **GET** request to `http://127.0.0.1:3000/videos/getvideos?p=1` where p is the page number. To switch pages use p=2 and so on.

<div align="center">
<img src="https://media.discordapp.net/attachments/744537793795194892/1013842196669153341/unknown.png?width=1237&height=657">
</div>

- [x] A basic search API to search the stored videos using their title and description.

Solution - We use a **POST** request to send a request to `http://127.0.0.1:3000/videos/searchvideos` with a body parameter containing raw text query like the image given below.

<div align="center">
<img src="https://media.discordapp.net/attachments/744537793795194892/1013842487439282256/unknown.png?width=1237&height=657"/>
</div>

- [x] Dockerize the project.

Solution - Using Docker. The working containers are shown below.
<div align="center">
<img src="https://media.discordapp.net/attachments/744537793795194892/1013842709544444068/unknown.png?width=1440&height=73"/>
</div>

- [x] It should be scalable and optimised.

Solution - Using MongoDB allows one to scale quite well compared to other databases. However to improve the scalability an integration of **Kubernetes** is required too. My project consists of the *deployment* and the *services* files for deploying to K8s.

## Bonus Points:

- [x] Add support for supplying multiple API keys so that if quota is exhausted on one, it automatically uses the next available key.

Solution - The `.env` file has a solution for using keys provided by the user. These keys are chosen at random at every request so as to avoid too much load on one API.

- [x] Make a dashboard to view the stored videos (`with filters and sorting options (optional)` - This is not implemented)

Solution - A dashboard created with the help of EJS was implemented. Here is how it looks.

<div align="center">
<img src="./images/displaydash.gif"/>
</div>

- [x] Optimise search api, so that it's able to search videos containing partial match for the search query in either video title or description.

Solution - Utilizing the in built MongoDB's Full Text Search feature - https://www.mongodb.com/basics/full-text-search. More information regarding this can be found in `models/videoModel.js`

## How To Build It Yourself

### Pre-requisites

1) MongoDB Atlas installed on your system. Follow the MongoDB [documentation](https://www.mongodb.com/docs/manual/installation/) for more information.
2) Docker and Docker compose installed on your system as mentioned in their documentation [here](https://docs.docker.com/get-docker/).
3) (Optional) Kubernetes installed on your system along with minikube.
4) (Optional if using Docker) NodeJs with all dependencies installed by running `npm install`.

Ensure you have a `.env` file which consists of the following -

```.env
MONGO_URI=mongodb://db:27017/prod
YOUTUBE_API=KEY1,KEY2,KEY3,KEY4,KEY5
PORT=3000
```
💡 If you are using the local mongodb server, change the MONGO_URI to `mongodb://localhost:27017/prod`. The configuration above is when you want to run it on Docker.

### Running It

1) Using Docker
If you want to use Docker for the installation and running the application without any installations. Run the following command -
```bash
docker-compose up -d
```
If your `.env` variables are correct your containers will be good to go. You can check the following by using `docker ps`.

2) Using NodeJs
Hoping your environment variables are setup and node dependencies are installed run `npm start`. You should be good to go!

### Accessing It
- **GET** `http://127.0.0.1:3000/videos/getvideos?p=1` - Access this from your browser to view a paginated response to the videos stored in the database, fetched by the API. These are the total responses. If you cannot see anything wait for a minute and try again.
- **POST** `http://127.0.0.1:3000/videos/searchvideos` - Search for videos in the database using this method. A body consisting of raw JSON needs to be present too like this -
```json
{
    "query" : "maths"
}
```

## Using Kubernetes aka K8s
1) Ensure minikube is running by using - `minikube status`
2) To deploy it run - `kubectl apply -f kubedeployment.yml`
3) Check if your deployment is running by using - `kubectl get deployment`
4) Finally run the service - `kubectl apply -f kubeservice.yml`

Done! You can get your deployment IP address by running - `minikube service ytAPI-service`. Use that IP in place of `127.0.0.1`.