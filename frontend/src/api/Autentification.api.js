import axios from 'axios';

export const getUsers = ()=> {
  return axios.get('http://localhost:8000/api/usuarios/');
}
  