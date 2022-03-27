package org.openpolito.app;

public class NotificationUtils {

    public static final String DEFAULT_TOPIC = "General";

    /**
     * Gets notification channel name
     * @param rawTopic the raw topic string from the remote message
     * @return notification channel name
     */
    public static String getChannelName(String rawTopic) {
        switch (rawTopic) {
            case "test":
                return "Test";
            case "individuale":
                return "Direct";
            case "avvisidoc":
                return "Notice";
            case "matdid":
                return "Material";
            default:
                return "General";
        }
    }
}
