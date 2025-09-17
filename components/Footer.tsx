export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "2rem",
        padding: "1rem",
        background: "#eee",
        textAlign: "center",
      }}
    >
      <p>&copy; {new Date().getFullYear()} E-commerce Graduation Project</p>
    </footer>
  );
}
