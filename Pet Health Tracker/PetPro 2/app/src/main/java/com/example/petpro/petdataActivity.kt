package com.example.petpro

import android.graphics.Color
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet

class petdataActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_data)

        // Initialize the chart
        val chart: LineChart = findViewById(R.id.weightChart)

        // Create dummy data
        val entries = listOf(
            Entry(1f, 5.2f),
            Entry(2f, 5.1f),
            Entry(3f, 5.3f)
        )

        // Create a dataset
        val dataSet = LineDataSet(entries, "Weight (kg)").apply {
            color = Color.BLUE
            valueTextColor = Color.BLACK
            lineWidth = 2f
            setDrawCircles(true)
            setDrawValues(true)
        }


        val lineData = LineData(dataSet)
        chart.data = lineData


        chart.description.text = "Pet Weight Over Time"
        chart.animateX(1000)
        chart.invalidate()
    }
}