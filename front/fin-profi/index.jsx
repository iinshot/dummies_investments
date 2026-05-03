import ReactDOM from "react-dom/client"
import App from "./src/App"
import { BrowserRouter } from "react-router-dom"

const root = ReactDOM.createRoot(document.querySelector("#root"))
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)