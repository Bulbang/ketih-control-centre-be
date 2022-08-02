// Builds correct path for lambda handlers
export const handlerPath = (context: string) => {
    return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`
}
