package com.example.petpro

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.CalendarView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class DayLogCalendarActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_day_log_calendar)

        findViewById<View>(R.id.calendar_view).setOnClickListener{
            val intent = Intent(this,LivePetLocationsActivity::class.java)
            startActivity(intent)
        }
        findViewById<View>(R.id.day_logs).setOnClickListener{
            val intent = Intent(this,DayLogCalendarActivity::class.java)
            startActivity(intent)
        }
        findViewById<View>(R.id.smart_summary).setOnClickListener{
            val intent = Intent(this,SmartSummaryActivity::class.java)
            startActivity(intent)
        }




        val calendarView: CalendarView = findViewById(R.id.calendarView)
        val selectedDateText: TextView = findViewById(R.id.selectedDateText)


        calendarView.setOnDateChangeListener { view, year, month, dayOfMonth ->

            val formattedDate = "$dayOfMonth/${month + 1}/$year"


            selectedDateText.text = "Selected Date: $formattedDate"
        }


    }
}
