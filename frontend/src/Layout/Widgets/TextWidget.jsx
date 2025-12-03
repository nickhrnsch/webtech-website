import Widget from "./Widget";

function TextWidget({
  title = "Notizen",
  text = "Dies ist ein Beispiel-Widget.",
}) {
  return (
    <Widget title={title}>
      <p>{text}</p>
    </Widget>
  );
}

export default TextWidget;
