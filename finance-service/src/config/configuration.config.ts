export default () => ({
    port: parseInt(process.env.NESTJS_PORT || "8082", 10) || 8082,
});
