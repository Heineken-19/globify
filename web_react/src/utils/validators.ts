export function validatePassword(password: string): string | null {
    if (password.length < 6) {
      return "A jelszónak legalább 6 karakter hosszúnak kell lennie.";
    }
    if (!/[A-Z]/.test(password)) {
      return "A jelszónak tartalmaznia kell nagybetűt.";
    }
    if (!/\d/.test(password)) {
      return "A jelszónak tartalmaznia kell számot.";
    }
    if (!/[._-]/.test(password)) {
      return "A jelszónak tartalmaznia kell pontot (.), kötőjelet (-) vagy alsó vonalat (_).";
    }
    return null;
  }
  