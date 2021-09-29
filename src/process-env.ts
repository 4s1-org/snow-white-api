import dotenv from 'dotenv'
dotenv.config()

/*
MQTT_SERVER=192.168.0.2
MQTT_PORT=8883
MQTT_USERNAME=foo
MQTT_PASSWORD=bar
MQTT_TOPIC_STOCK=foo/bar
*/

export abstract class ProcessEnv {
  public static get NODE_ENV(): string {
    return process.env.NODE_ENV || ''
  }

  public static get MQTT_SERVER(): string {
    return process.env.MQTT_SERVER || ''
  }

  public static get MQTT_PORT(): number {
    return +(process.env.MQTT_PORT || 0)
  }

  public static get MQTT_USERNAME(): string {
    return process.env.MQTT_USERNAME || ''
  }

  public static get MQTT_PASSWORD(): string {
    return process.env.MQTT_PASSWORD || ''
  }

  public static get MQTT_TOPIC_STOCK(): string {
    return process.env.MQTT_TOPIC_STOCK || ''
  }
}
