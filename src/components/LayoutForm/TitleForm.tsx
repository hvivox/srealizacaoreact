import { ReactNode } from "react";

export const TitleForm = ({ children }: { children: ReactNode }) => {
  return (
    //preciso acrescentar uma margens no top do div
    <div>
      <h1>{children}</h1>
    </div>
  );
}; //Crie um componente para o título do formulário.
