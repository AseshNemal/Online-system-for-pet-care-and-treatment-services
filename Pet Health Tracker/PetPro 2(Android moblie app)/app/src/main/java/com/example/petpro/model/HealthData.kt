package com.example.petpro

import java.text.SimpleDateFormat
import java.util.*

data class HealthData(
    var AirQuality: String? = null,
    var Altitude: String? = null,
    var Battery: String? = null,
    var DeviceID: String? = null,
    var En_temperature: String? = null,
    var Latitude: String? = null,
    var Longitude: String? = null,
    var Temperature: String? = null,
    var en_humidity: String? = null,
    var hartrate: String? = null,
    var step: String? = null,
    var timestamp: String? = null,
    var timestampMillis: Long = 0L
) {
    fun isAprilData(): Boolean {
        return try {
            val format = SimpleDateFormat("dd/MM/yyyy, HH:mm:ss", Locale.getDefault())
            val date = format.parse(timestamp ?: "") ?: return false
            val calendar = Calendar.getInstance().apply { time = date }
            calendar.get(Calendar.MONTH) + 1 == 4 // April is month 4
        } catch (e: Exception) {
            false
        }
    }

    fun parseTimestamp(): Long {
        return try {
            val format = SimpleDateFormat("dd/MM/yyyy, HH:mm:ss", Locale.getDefault())
            format.parse(timestamp ?: "")?.time ?: 0L
        } catch (e: Exception) {
            0L
        }
    }

    fun getTemperatureFloat(): Float? = Temperature?.toFloatOrNull()
    fun getHeartRateFloat(): Float? = hartrate?.toFloatOrNull()
    fun getStepsFloat(): Float? = step?.toFloatOrNull()
    fun getAirQualityFloat(): Float? = AirQuality?.toFloatOrNull()
    fun getHumidityFloat(): Float? = en_humidity?.toFloatOrNull()
    fun getBatteryInt(): Int? = Battery?.toIntOrNull()
}