export function Footer() {
  return (
    <footer className="py-6 mt-12 bg-transparent">
      <div className="container mx-auto text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Babylon Block. All rights reserved.</p>
      </div>
    </footer>
  );
}
