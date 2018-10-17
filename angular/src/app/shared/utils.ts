export default class Utils {
    /**
     * parseJSON returns a parsed object from the supplied string if possible
     * @param str String that is potentially JSON
     */
    public static parseJSON (str: string): object | string {
        try {
            let obj: object = JSON.parse(str);
            // JSON.parse(null) => null, so check for it here.
            if (obj && typeof obj === 'object') {
                return obj;
            }
        } catch (err) {
            // Return str instead
        }

        return str;
    }
}
