import { useEffect } from "react";
import { getUsers } from "./../api/Autentification.api.js";

export function Loggin() {
    useEffect(() => {
        getUsers()
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
            });
    }, []);

    return (
        <div>
            <h1>Loggin Component</h1>
        </div>
    );
}