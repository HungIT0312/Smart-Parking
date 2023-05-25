import React from "react";
import { useState } from "react";
import { createContext } from "react";

export const IdClientContext = createContext({ id: null });
const ClientContext = (props) => {
  const [Id, setID] = useState("");

  return (
    <IdClientContext.Provider value={{ Id: Id, setID: setID }}>
      {props.children}
    </IdClientContext.Provider>
  );
};

export default ClientContext;
