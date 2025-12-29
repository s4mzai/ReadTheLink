export function isValidUrl(value:string){
    if(!value.startsWith("http://") && !value.startsWith("https://")) return false;

    try{
        const url = new URL(value)

        if (!url.hostname || !url.hostname.includes(".")) return false;
        
        return true
    } catch {
        return false
    }
}