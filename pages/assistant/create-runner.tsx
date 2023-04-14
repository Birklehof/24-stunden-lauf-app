import { useEffect, useState } from "react";
import Head from "@/components/Head";
import Loading from "@/components/Loading";
import useAuth from "@/lib/hooks/useAuth";
import AssistantMenu from "@/components/AssistantMenu";
import useRunners from "@/lib/hooks/useRunners";

export default function AssistantCreateRunner() {
  const { isLoggedIn, user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState(0);
  const { createRunner } = useRunners();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  if (!user) {
    return <Loading />;
  }

  async function addRunner() {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      setNumber(await createRunner(name));
    } catch (e: any) {
      if (e instanceof Error) {
        alert(e.message);
        return;
      }
      throw e;
    }

    setSubmitting(false);
  }

  return (
    <>
      <Head title="Assistent" />
      <main className="flex bg-base-200 justify-center h-screen items-center">
        <AssistantMenu />
        <div className="flex flex-row h-1/5 items-center gap-2 lg:w-1/2 justify-around">
          <div className="card max-w-sm w-full shadow-lg bg-base-100 mx-2">
            <div className="card-body gap-3">
              {number != 0 ? (
                <>
                  <h1 className="text-center font-bold text-xl">
                    Läufer erstellt
                  </h1>
                  <input
                    name={"text"}
                    className="input input-bordered w-full max-w-xs input-disabled"
                    readOnly={true}
                    type={"text"}
                    value={"Startnummer: " + number}
                    required
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setNumber(0);
                      setName("");
                    }}
                  >
                    Okay!
                  </button>
                </>
              ) : (
                <>
                  <h1 className="text-center font-bold text-xl">
                    Läufer hinzufügen
                  </h1>
                  <input
                    name={"text"}
                    className="input input-bordered w-full max-w-xs"
                    placeholder="Name"
                    autoFocus
                    onChange={(e) => {
                      e.preventDefault();
                      setName(e.target.value);
                    }}
                    type={"text"}
                    value={name}
                    required
                  />
                  <button
                    className="btn btn-primary"
                    onClick={addRunner}
                    disabled={submitting || name.length == 0}
                  >
                    Hinzufügen
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
