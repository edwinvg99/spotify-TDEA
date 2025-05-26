import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "../services/firebase";

function SignInGoogle() {
  function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      const user = result.user;
      if (result.user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: user.displayName,
          photo: user.photoURL,
          lastName: "",
        });
        toast.success("Inicio de sesión exitoso", {
          position: "top-center",
        });
        window.location.href = "/profile";
      }
    });
  }

  return (
    <div className="mt-8">
      <div
        onClick={googleLogin}
        className=" flex items-center justify-center gap-3 px-4 rounded-lg cursor-pointer  transition delay-50 duration-200 ease-in-out hover:scale-[1.2] "
      >
        <img
          src="../../../../public/assets/google.png"
          className="w-full h-20 scale-75"
          alt="Google logo"
        />
      </div>
    </div>
  );
}

export default SignInGoogle;
