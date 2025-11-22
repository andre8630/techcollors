function status(request, respose) {
  return respose.status(200).json({ message: "Status ok" });
}

export default status;
