// export default interface IUserAuthState {
//     username: string,
//     password : string,
//     callback : () => void;
// }

export default interface IAuthUserInfoState {
    authInfo : {
        id: string,
        firstName : string,
        lastName: string,
        phoneCode : string,
        mobile : number,
        email : string,
        token : string,
    }
}