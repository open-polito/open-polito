package org.openpolito.app;

public class NotificationUtils {

    public static final int DEFAULT_TOPIC = R.string.notification_channel_general;

    /**
     * Details about the notification channel
     */
    static class NotificationChannelDetails {
        public int id;
        public int title;
        public int description;

        public NotificationChannelDetails(int id, int title, int description) {
            this.id = id;
            this.title = title;
            this.description = description;
        }
    }

    /**
     * Gets notification channel details
     * @param rawTopic the raw topic string from the remote message
     * @return notification channel details
     */
    public static NotificationChannelDetails getChannelDetails(String rawTopic) {
        switch (rawTopic) {
            case "test":
                return new NotificationChannelDetails(R.string.notification_channel_test_id, R.string.notification_channel_test, R.string.notification_channel_test_desc);
            case "individuale":
                return new NotificationChannelDetails(R.string.notification_channel_direct_id, R.string.notification_channel_direct, R.string.notification_channel_direct_desc);
            case "avvisidoc":
                return new NotificationChannelDetails(R.string.notification_channel_notices_id, R.string.notification_channel_notices, R.string.notification_channel_notices_desc);
            case "matdid":
                return new NotificationChannelDetails(R.string.notification_channel_material_id, R.string.notification_channel_material, R.string.notification_channel_material_desc);
            default:
                return new NotificationChannelDetails(R.string.notification_channel_general_id, R.string.notification_channel_general, R.string.notification_channel_general_desc);
        }
    }
}
