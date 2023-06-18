export default function (file, callback) {
    const reader = new FileReader();
    reader.onload = () => callback(null, reader.result);
    reader.onerror = (err) => callback(err);
    reader.readAsText(file);
}