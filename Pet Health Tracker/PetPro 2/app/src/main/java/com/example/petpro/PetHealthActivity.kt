package com.example.petpro

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.firebase.database.*
import java.text.SimpleDateFormat
import java.util.Locale

class PetHealthActivity : AppCompatActivity() {

    private val TAG = "PetHealthActivity"
    private val database = FirebaseDatabase.getInstance()
    private val healthDataRef = database.getReference("petcare")

    // Views
    private lateinit var connectionStatusIcon: ImageView
    private lateinit var connectionStatusText: TextView
    private lateinit var temperatureSummary: TextView
    private lateinit var heartRateSummary: TextView
    private lateinit var stepsSummary: TextView
    private lateinit var airQualitySummary: TextView
    private lateinit var humiditySummary: TextView
    private lateinit var batterySummary: TextView
    private lateinit var lastUpdatedText: TextView
    private lateinit var healthDataTable: TableLayout

    // Charts
    private lateinit var temperatureChart: LineChart
    private lateinit var heartRateChart: LineChart
    private lateinit var stepsChart: LineChart
    private lateinit var airQualityChart: LineChart
    private lateinit var humidityChart: LineChart

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pet_health)

        initViews()
        initializeCharts()
        setupBottomNavigation()
        fetchAprilHealthData()
    }

    private fun initViews() {
        connectionStatusIcon = findViewById(R.id.connectionStatusIcon)
        connectionStatusText = findViewById(R.id.connectionStatusText)
        temperatureSummary = findViewById(R.id.temperatureSummary)
        heartRateSummary = findViewById(R.id.heartRateSummary)
        stepsSummary = findViewById(R.id.stepsSummary)
        airQualitySummary = findViewById(R.id.airQualitySummary)
        humiditySummary = findViewById(R.id.humiditySummary)
        batterySummary = findViewById(R.id.batterySummary)
        lastUpdatedText = findViewById(R.id.lastUpdatedText)
        healthDataTable = findViewById(R.id.healthDataTable)

        temperatureChart = findViewById(R.id.temperatureChart)
        heartRateChart = findViewById(R.id.heartRateChart)
        stepsChart = findViewById(R.id.stepsChart)
        airQualityChart = findViewById(R.id.airQualityChart)
        humidityChart = findViewById(R.id.humidityChart)
    }

    private fun initializeCharts() {
        setupChart(temperatureChart, "April Temperature (°C)")
        setupChart(heartRateChart, "April Heart Rate (BPM)")
        setupChart(stepsChart, "April Steps Count")
        setupChart(airQualityChart, "April Air Quality (ppm)")
        setupChart(humidityChart, "April Humidity (%)")
    }

    private fun setupChart(chart: LineChart, label: String) {
        chart.description.text = label
        chart.setTouchEnabled(true)
        chart.setPinchZoom(true)
        chart.setDrawGridBackground(false)
        chart.setNoDataText("Loading April data...")
        chart.animateY(1000)

        chart.xAxis.position = XAxis.XAxisPosition.BOTTOM
        chart.xAxis.setDrawGridLines(false)
        chart.xAxis.granularity = 1f

        chart.axisRight.isEnabled = false
        chart.axisLeft.setDrawGridLines(true)
        chart.legend.isEnabled = false
    }

    private fun fetchAprilHealthData() {
        Log.d(TAG, "Fetching April health data from Firebase...")

        healthDataRef.orderByChild("timestamp")
            .addListenerForSingleValueEvent(object : ValueEventListener {
                override fun onDataChange(dataSnapshot: DataSnapshot) {
                    val aprilDataList = mutableListOf<HealthData>()
                    val aprilTimestamps = mutableListOf<String>()

                    dataSnapshot.children.forEach { snapshot ->
                        try {
                            val data = snapshot.getValue(HealthData::class.java)?.apply {
                                timestampMillis = parseTimestamp()
                            }
                            data?.let {
                                if (it.isAprilData()) {
                                    aprilDataList.add(it)
                                    aprilTimestamps.add(formatDateForDisplay(it.timestamp ?: ""))
                                }
                            }
                        } catch (e: Exception) {
                            Log.e(TAG, "Error parsing snapshot ${snapshot.key}: ${e.message}")
                        }
                    }

                    // Sort April data by timestamp (newest first)
                    val sortedAprilData = aprilDataList.sortedByDescending { it.timestampMillis }

                    Log.d(TAG, "Found ${sortedAprilData.size} April data points")
                    if (sortedAprilData.isNotEmpty()) {
                        Log.d(TAG, "Newest April data: ${sortedAprilData.first().timestamp}")
                        Log.d(TAG, "Oldest April data: ${sortedAprilData.last().timestamp}")
                    }

                    runOnUiThread {
                        if (sortedAprilData.isEmpty()) {
                            showEmptyState("No April data available")
                        } else {
                            // Only show the latest 24 April data points
                            updateUIWithAprilData(
                                sortedAprilData.take(24),
                                aprilTimestamps.take(24)
                            )
                        }
                    }
                }

                override fun onCancelled(databaseError: DatabaseError) {
                    Log.e(TAG, "Firebase error: ${databaseError.message}")
                    runOnUiThread { showEmptyState("Failed to load April data") }
                }
            })
    }

    private fun updateUIWithAprilData(aprilData: List<HealthData>, aprilTimestamps: List<String>) {
        val lastAprilData = aprilData.firstOrNull() ?: return showEmptyState("No April data available")

        // Update connection status (historical data shows as disconnected)
        updateConnectionStatus(false)

        // Update summary views with April prefix
        temperatureSummary.text = lastAprilData.getTemperatureFloat()?.let { "Apr: %.1f°C".format(it) } ?: "Apr: --"
        heartRateSummary.text = lastAprilData.getHeartRateFloat()?.let { "Apr: %.0f BPM".format(it) } ?: "Apr: --"
        stepsSummary.text = lastAprilData.getStepsFloat()?.let { "Apr: %.0f".format(it) } ?: "Apr: --"
        airQualitySummary.text = lastAprilData.getAirQualityFloat()?.let {
            "Apr: ${it.toInt()} ppm (${getAirQualityString(it.toInt())})"
        } ?: "Apr: --"
        humiditySummary.text = lastAprilData.getHumidityFloat()?.let { "Apr: %.0f%%".format(it) } ?: "Apr: --"
        batterySummary.text = lastAprilData.getBatteryInt()?.let {
            if (it >= 0) "Apr: $it%" else "Apr: N/A"
        } ?: "Apr: --"

        // Update last updated time with April date
        lastUpdatedText.text = "April data from: ${formatDateForDisplay(lastAprilData.timestamp ?: "")}"

        // Update charts and table
        updateAprilCharts(aprilData, aprilTimestamps)
        updateAprilDataTable(aprilData)
    }

    private fun updateAprilCharts(aprilData: List<HealthData>, aprilTimestamps: List<String>) {
        val tempEntries = aprilData.mapIndexedNotNull { index, data ->
            data.getTemperatureFloat()?.let { Entry(index.toFloat(), it) }
        }
        val hrEntries = aprilData.mapIndexedNotNull { index, data ->
            data.getHeartRateFloat()?.let { Entry(index.toFloat(), it) }
        }
        val stepEntries = aprilData.mapIndexedNotNull { index, data ->
            data.getStepsFloat()?.let { Entry(index.toFloat(), it) }
        }
        val airQualityEntries = aprilData.mapIndexedNotNull { index, data ->
            data.getAirQualityFloat()?.let { Entry(index.toFloat(), it) }
        }
        val humidityEntries = aprilData.mapIndexedNotNull { index, data ->
            data.getHumidityFloat()?.let { Entry(index.toFloat(), it) }
        }

        runOnUiThread {
            val xAxisFormatter = IndexAxisValueFormatter(aprilTimestamps)

            listOf(temperatureChart, heartRateChart, stepsChart, airQualityChart, humidityChart).forEach {
                it.xAxis.valueFormatter = xAxisFormatter
            }

            temperatureChart.data = createLineData(tempEntries, "Temperature", Color.parseColor("#FF5722"))
            heartRateChart.data = createLineData(hrEntries, "Heart Rate", Color.parseColor("#F44336"))
            stepsChart.data = createLineData(stepEntries, "Steps", Color.parseColor("#4CAF50"))
            airQualityChart.data = createLineData(airQualityEntries, "Air Quality", Color.parseColor("#2196F3"))
            humidityChart.data = createLineData(humidityEntries, "Humidity", Color.parseColor("#9C27B0"))

            // Configure Y-axis ranges
            airQualityChart.axisLeft.apply {
                axisMinimum = 0f
                axisMaximum = 1000f
                granularity = 200f
            }

            humidityChart.axisLeft.apply {
                axisMinimum = 0f
                axisMaximum = 100f
                granularity = 20f
            }

            // Refresh all charts
            listOf(temperatureChart, heartRateChart, stepsChart, airQualityChart, humidityChart).forEach {
                it.invalidate()
            }
        }
    }

    private fun updateAprilDataTable(aprilData: List<HealthData>) {
        healthDataTable.removeAllViews()

        if (aprilData.isEmpty()) return

        // Create header row
        val headerRow = TableRow(this).apply {
            addView(createHeaderTextView("Date"))
            addView(createHeaderTextView("Temp (°C)"))
            addView(createHeaderTextView("HR (BPM)"))
            addView(createHeaderTextView("Air Q (ppm)"))
            addView(createHeaderTextView("Humidity (%)"))
        }
        healthDataTable.addView(headerRow)

        // Add data rows (show latest April entries)
        aprilData.take(10).forEach { data ->
            val row = TableRow(this).apply {
                addView(createDataTextView(formatDateForTable(data.timestamp ?: "")))
                addView(createDataTextView(data.getTemperatureFloat()?.let { "%.1f".format(it) } ?: "--"))
                addView(createDataTextView(data.getHeartRateFloat()?.let { "%.0f".format(it) } ?: "--"))
                addView(createDataTextView(data.getAirQualityFloat()?.let { "%.0f".format(it) } ?: "--"))
                addView(createDataTextView(data.getHumidityFloat()?.let { "%.0f%%".format(it) } ?: "--"))
            }
            healthDataTable.addView(row)
        }
    }

    private fun createLineData(entries: List<Entry>, label: String, color: Int): LineData {
        val dataSet = LineDataSet(entries, label).apply {
            this.color = color
            valueTextColor = Color.BLACK
            valueTextSize = 10f
            setCircleColor(color)
            lineWidth = 2f
            circleRadius = 4f
            setDrawValues(false)
            mode = LineDataSet.Mode.CUBIC_BEZIER
            cubicIntensity = 0.2f
            fillAlpha = 65
            fillColor = color
            setDrawFilled(true)
        }
        return LineData(dataSet)
    }

    private fun createHeaderTextView(text: String): TextView {
        return TextView(this).apply {
            this.text = text
            setTextColor(Color.WHITE)
            setBackgroundColor(ContextCompat.getColor(this@PetHealthActivity, R.color.primary_color))
            gravity = android.view.Gravity.CENTER
            setPadding(8, 16, 8, 16)
            setTypeface(typeface, android.graphics.Typeface.BOLD)
        }
    }

    private fun createDataTextView(text: String): TextView {
        return TextView(this).apply {
            this.text = text
            setTextColor(Color.BLACK)
            gravity = android.view.Gravity.CENTER
            setPadding(8, 16, 8, 16)
            setBackgroundResource(R.drawable.table_cell_border)
        }
    }

    private fun formatDateForDisplay(timestamp: String): String {
        return try {
            val inputFormat = SimpleDateFormat("dd/MM/yyyy, HH:mm:ss", Locale.getDefault())
            val outputFormat = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
            val date = inputFormat.parse(timestamp)
            outputFormat.format(date ?: return timestamp)
        } catch (e: Exception) {
            timestamp
        }
    }

    private fun formatDateForTable(timestamp: String): String {
        return try {
            val inputFormat = SimpleDateFormat("dd/MM/yyyy, HH:mm:ss", Locale.getDefault())
            val outputFormat = SimpleDateFormat("MMM dd", Locale.getDefault())
            val date = inputFormat.parse(timestamp)
            outputFormat.format(date ?: return timestamp)
        } catch (e: Exception) {
            timestamp
        }
    }

    private fun getAirQualityString(value: Int): String {
        return when {
            value < 50 -> "Good"
            value < 100 -> "Moderate"
            value < 150 -> "Unhealthy (Sensitive)"
            value < 200 -> "Unhealthy"
            value < 300 -> "Very Unhealthy"
            else -> "Hazardous"
        }
    }

    private fun updateConnectionStatus(isConnected: Boolean) {
        runOnUiThread {
            if (isConnected) {
                connectionStatusIcon.setImageResource(R.drawable.ic_connected)
                connectionStatusText.text = "Connected"
                connectionStatusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_green_dark))
            } else {
                connectionStatusIcon.setImageResource(R.drawable.ic_disconnected)
                connectionStatusText.text = "Historical Data"
                connectionStatusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_orange_dark))
            }
        }
    }

    private fun showEmptyState(message: String = "No data available") {
        runOnUiThread {
            connectionStatusIcon.setImageResource(R.drawable.ic_disconnected)
            connectionStatusText.text = message
            connectionStatusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_orange_dark))

            temperatureSummary.text = "--"
            heartRateSummary.text = "--"
            stepsSummary.text = "--"
            airQualitySummary.text = "--"
            humiditySummary.text = "--"
            batterySummary.text = "--"

            lastUpdatedText.text = "Last updated: Never"
        }
    }

    private fun setupBottomNavigation() {
        val bottomNavigationView: BottomNavigationView = findViewById(R.id.bottom_navigation)
        bottomNavigationView.selectedItemId = R.id.nav_stats

        bottomNavigationView.setOnItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_pet_logs -> {
                    startActivity(Intent(this, MainActivity::class.java))
                    overridePendingTransition(0, 0)
                    true
                }
                R.id.nav_records -> {
                    startActivity(Intent(this, VaccinationsActivity::class.java))
                    overridePendingTransition(0, 0)
                    true
                }
                R.id.nav_stats -> true
                R.id.nav_account -> {
                    startActivity(Intent(this, UserAccountActivity::class.java))
                    overridePendingTransition(0, 0)
                    true
                }
                else -> false
            }
        }
    }
}