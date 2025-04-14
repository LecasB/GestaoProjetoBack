export const GetTeste = async (req, res) => {
  try {
    const data = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "Hello from the test controller!" });
      }, 1000);
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error in GetTeste:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
