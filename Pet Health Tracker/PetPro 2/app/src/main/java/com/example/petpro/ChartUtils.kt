package com.example.petpro

import android.content.Context
import android.graphics.Color
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.components.YAxis
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.formatter.ValueFormatter
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object ChartUtils {

    fun setupChart(
        chart: LineChart,
        label: String,
        color: Int,
        entries: List<Entry>,
        xAxisFormatter: ValueFormatter? = null
    ) {
        // Configure chart appearance
        with(chart) {
            description.isEnabled = false
            setTouchEnabled(true)
            isDragEnabled = true
            setScaleEnabled(true)
            setPinchZoom(true)
            setDrawGridBackground(false)
            isHighlightPerDragEnabled = true
            legend.isEnabled = false
        }

        // Configure X-axis
        with(chart.xAxis) {
            position = XAxis.XAxisPosition.BOTTOM
            setDrawGridLines(false)
            granularity = 1f
            labelRotationAngle = -45f
            xAxisFormatter?.let { valueFormatter = it }
        }

        // Configure Y-axis
        with(chart.axisLeft) {
            setDrawGridLines(true)
            axisMinimum = 0f
            setLabelCount(6, true)
        }

        chart.axisRight.isEnabled = false

        // Create dataset
        val dataSet = LineDataSet(entries, label).apply {
            setColor(color)
            var circleColor = color
            lineWidth = 2f
            circleRadius = 4f
            setDrawCircleHole(false)
            valueTextSize = 10f
            setDrawFilled(true)
            fillColor = color
            fillAlpha = 60
            mode = LineDataSet.Mode.CUBIC_BEZIER
            setDrawValues(false)
        }

        // Set data to chart
        chart.data = LineData(dataSet)
        chart.invalidate()
    }

    fun updateChart(chart: LineChart, newEntries: List<Entry>) {
        chart.data?.let { lineData ->
            if (lineData.dataSetCount > 0) {
                (lineData.getDataSetByIndex(0) as? LineDataSet)?.values = newEntries
                lineData.notifyDataChanged()
                chart.notifyDataSetChanged()
                chart.invalidate()
            }
        }
    }

    class TimeValueFormatter(private val timestamps: List<Long>) : ValueFormatter() {
        private val timeFormat = SimpleDateFormat("HH:mm", Locale.getDefault())

        override fun getFormattedValue(value: Float): String {
            val index = value.toInt()
            return if (index in timestamps.indices) {
                timeFormat.format(Date(timestamps[index]))
            } else ""
        }
    }
}