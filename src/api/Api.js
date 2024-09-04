import axios from "axios";


// const Api = axios.create({
//     baseURL: 'http://localhost:2600'
// });
const Api = axios.create({
    baseURL: 'https://myserverback.onrender.com'
});

export default Api;