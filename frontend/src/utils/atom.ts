import { atom } from "recoil";

interface Todo {
    createdAt: Date;
    deadline: Date;
    description: string;
    isComplete: boolean;
    title: string;
    todoCategoryId: string;
    updatedAt: Date;
    __v: number;
    _id: string;
}

const currentUser = atom({
    key: "currentUser",
    default: {
        userid: "",
        username: "",
        email: "",
    },
});

const categoryReRender = atom({
    key: "categoryReRender",
    default: false,
});

const todoReRender = atom({
    key: "todoReRender",
    default: false,
});

const activeCategory = atom({
    key: "activeCategory",
    default: "",
});

const popoverState = atom({
    key: "popoverState",
    default: false,
});

const todosState = atom<Todo[]>({
    key: "todosState",
    default: [],
});

export {
    currentUser,
    categoryReRender,
    todoReRender,
    activeCategory,
    popoverState,
    todosState,
};
