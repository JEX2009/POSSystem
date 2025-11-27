
const ErrorMessage = ({ message, yesOption, noOption }) => (
    <div className="grid justify-center items-center p-8 rounded bg-white">
        <p>{message}</p>
        <div className="grid grid-cols-2">
        <button className="bg-green-100 border border-green-600 rounded m-5 cursor-pointer p-1" onClick={yesOption}>Si</button>
        <button className="bg-red-100 border border-red-600 rounded m-5 p-1 cursor-pointer" onClick={noOption}>No</button>
        </div>
    </div>
);
export default ErrorMessage;