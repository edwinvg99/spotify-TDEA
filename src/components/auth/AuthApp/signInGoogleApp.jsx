

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";

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
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="pb-10 text-gray-400 ">
            O continúa con
          </span>
        </div>
      </div>

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
