import { Inter } from "next/font/google";
import axios from "axios";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { VerfiyToken } from "@/utils/auth";
import userModel from "@/model/userModel";
import { useState } from "react";
import todoModel from "@/model/todoModel";
import { useRouter } from "next/router";
import ConectToDB from "@/configs/db";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ userData, todoList: todoData }) {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);

  const [todoValue, setTodoValue] = useState("");

  const [todosList, setTodosList] = useState([...todoData]);

  const getAllTodo = async () => {
    const res = await axios.get("/api/todo");

    if (res.status === 200) {
      setTodosList(res.data);
      // console.log(res);
    }
  };

  const createTodoHandler = async () => {
    axios
      .post("/api/todo", { title: todoValue, isCompleted: false })
      .then((res) => {
        setTodoValue("");
        alert("create todo successfully");
        getAllTodo();
      })
      .catch((err) => {
        alert(err.message);
        console.log(err);
      });
  };

  const deleteTodoHandler = async (id) => {
    axios
      .delete(`/api/todo/${id}`)
      .then((res) => {
        alert("todo successfully deleted !");
        getAllTodo();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editTodoHandler = async (id, item) => {
    //
    axios
      .patch(`api/todo/${id}`, { isCompleted: !item?.isCompleted })
      .then((res) => {
        getAllTodo();
        alert("todo successfully completed");
        // console.log(todosList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const LoggedOutHandler = async () => {
    axios
      .get("/api/auth/signout")
      .then((res) => {
        router.push("/signin");
        // console.log(res);
        alert(res.data.message);
      })
      .catch((err) => console.log(err.message));
  };
  return (
    <>
      <h1>Next-Todos</h1>

      <div className="alert">
        <p>⚠ Please add a task first!</p>
      </div>

      <div className="container">
        <div
          className="form-container"
          style={{ display: showInput ? "block" : "none" }}
        >
          <div className="add-form">
            <input
              id="input"
              type="text"
              placeholder="Type your To-Do works..."
              value={todoValue}
              onChange={(e) => setTodoValue(e.target.value)}
            />
            <button type="submit" id="submit" onClick={createTodoHandler}>
              ADD
            </button>
          </div>
        </div>
        <div className="head">
          <div className="date">
            <p>
              {userData?.firstName} - {userData?.lastName}
            </p>
          </div>
          <div className="add" onClick={() => setShowInput(!showInput)}>
            <svg
              width="2rem"
              height="2rem"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
              />
              <path
                fillRule="evenodd"
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
              />
            </svg>
          </div>
          <div className="time" onClick={LoggedOutHandler}>
            <a href="#">Logout</a>
          </div>
        </div>
        <div className="pad">
          <div id="todo">
            <ul id="tasksContainer">
              {todosList?.map((item) => (
                <li>
                  <span
                    className="mark"
                    onClick={() => {
                      editTodoHandler(item._id, item);
                    }}
                  >
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={item?.isCompleted}
                    />
                  </span>
                  <div className="list">
                    <p>{item.title}</p>
                  </div>
                  <span
                    className="delete"
                    onClick={() => deleteTodoHandler(item._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

// route protection :

export async function getServerSideProps(context) {
  ConectToDB();
  const { token } = context.req.cookies;
  if (!token) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  const paylaodToken = VerfiyToken(token);

  if (!paylaodToken) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  const userData = await userModel.findOne(
    { email: paylaodToken.email },
    "firstName lastName _id"
  );

  const todoList = await todoModel.find({ user: userData._id });

  return {
    props: {
      userData: JSON.parse(JSON.stringify(userData)),
      todoList: JSON.parse(JSON.stringify(todoList)),
    },
  };
}
