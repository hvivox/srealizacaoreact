import { ReactNode } from "react";

export const TitleForm = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <h1>{children}</h1>
    </div>
  );
}; //Crie um componente para o título do formulário.
