import { atom } from 'recoil';

export const inputInfoState = atom({
    key: "inputInfoState",
    default: {
        email: "",
        password: "",
        confirmedPW: "",
        username: "",
        selectedFile: null,
        tag: ""
    }
});
