import axios from "axios";


const Api = axios.create({
    baseURL: 'http://localhost:2600'
});
// const Api = axios.create({
//     baseURL: 'https://portfolionow-back.onrender.com'
// });

export default Api;