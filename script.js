    const yearSelect = document.getElementById("years");
    const uploadBtn = document.getElementById("uploadBtn");
    const reportBtn = document.getElementById("reportBtn");
    const fileInput = document.getElementById("csvFile");
    const landing = document.getElementById("landing");
    const wrapped = document.getElementById("wrapped");
    const loadingOverlay = document.getElementById("loading-overlay");

    uploadBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const file = fileInput.files[0];
      if (!file) {
        alert("Please choose a CSV file.");
        return;
      }

      const selectedYear = yearSelect.value;


      loadingOverlay.classList.add("visible");

      try{
        const formData = new FormData();
        formData.append("file", file);
        formData.append("year", selectedYear);

        console.log("Selectred year:", selectedYear)

        const response = await fetch("https://goodreadswrappeduvicorn-main-app-host-0.onrender.com/upload", {
        method: "POST",
        body: formData,

      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Error");
      }
      showWrapped(data);
    } catch(err) {
      alert(err.message);
    }
    });

    function showWrapped(data) {
      landing.classList.add("hidden");

      setTimeout(() => {
        landing.style.display = "none";

        wrapped.classList.add("visible");
        loadingOverlay.classList.remove("visible");
        // document.getElementById("nav-controls").classList.add("visible");

        // renderSummary(data.year_summary);
        // renderBookends(data.year_summary);
        renderMonths(data.monthly_stats, data.year_summary, data);
        // renderReadingPeaks(data)
        // renderRatingPeaks(data);
        // renderFiveStarBooks(data);

        initSlides(5);
      }, 800);
    }

// function renderSummary(summary) {
//   document.getElementById("slide-summary").innerHTML = `
//     <div class="summary-card">
//         <div class="slide-content">    
//         <p style="letter-spacing: 2px; text-transform: uppercase; color: #666;">
//             ${summary.year}
//         </p>

//         <h1>Your year in reading...</p>
//         <p class="big-number">${summary.total_books}</p>
//         <p class="subtitle">total books read</p>

//         <div style="margin-top: 60px;">
//             <p class="big-number" style="font-size:64px;">
//             ${summary.pages_read}
//             </p>
//             <p class="subtitle">totalpages read</p>
//         </div>
//         </div>
//     </div>
//   `;
// }

// function renderBookends(summary) {
//   document.getElementById("slide-bookends").innerHTML = `
//   <div class="summary-card">
//     <div class="slide-content">
//       <h2>Bookends</h2>
//       <p><b>First Book of the Year:</b><br> 
//         ${summary.first_book.title} by ${summary.first_book.author}
//         (${summary.first_book.pages} pages, read in ${summary.first_book.month})
//       </p>
//       <p><b>Last Book of the Year:</b><br> 
//         ${summary.last_book.title} by ${summary.last_book.author}
//         (${summary.last_book.pages} pages, read in ${summary.last_book.month})
//       </p>
//       <p><b>Longest Book of the Year:</b><br> 
//         ${summary.longest_book.title} by ${summary.longest_book.author}
//         (${summary.longest_book.pages} pages, read in ${summary.longest_book.month})
//       </p>
//       <p><b>Shortest Book of the Year:</b><br> 
//         ${summary.shortest_book.title} by ${summary.shortest_book.author}
//         (${summary.shortest_book.pages} pages, read in ${summary.shortest_book.month})
//       </p>
//     </div>
//   </div>
//   `
// }

   function renderMonths(monthly, summary, peaks) {
  const monthCards = monthly.map(m => `
    <div class="month-card">
      <h3>${m.month}</h3>

      <div class="month-stat">
        <span class="label">Books Read</span>
        <span class="value">${m.books_read}</span>
      </div>
      <div class="month-stat">
        <span class="label">Pages Read</span>
        <span class="value">${m.pages_read}</span>
      </div>

      <div class="month-stat">
        <span class="label">Number of Five Star Reviews</span>
        <span class="value">${m.five_star_books}</span>
      </div>

      <div class="month-stat">
        <span class="label">Percentage of Five Star Books</span>
        <span class="value">${m.five_star_percentage}%</span>
      </div>
    </div>
  `).join("");

  document.getElementById("slide-months").innerHTML = `
    <div class="slide-content">
      <div class="summary-card">
        <p style="letter-spacing: 4px; text-transform: uppercase; color: #666;">
          ${summary.year}
        </p>
        <h2 class="title">Your year in reading</h2>
      </div>
        <div class="summary-columns">
            <div class="summary-stats">
                <p class="big-number">${summary.total_books}</p>
                <p class="subtitle">total books read</p>

                    <div style="margin-top: 40px;">
                        <p class="big-number" style="font-size:64px;">
                        ${summary.pages_read}
                        </p>
                        <p class="subtitle">total pages read</p>
                    </div>
            </div>
        
            <div class="summary-stats">
            
                <p class="big-number stat-number">
                    ${summary.avg_rating}
                </p>
                <p class="subtitle">Average Rating</p>
                    <p class="big-number stat-number">
                        ${summary.num_five_star}
                    </p>
                <p class="subtitle">Number of Five Star Books</p>
            </div>
        </div>
        <div class="summary-stats">
            <div class="summary-card book-grid">
                <div class="book-item">
                    <p class ="subtitle"><b>First book:</b> <br>
                    ${summary.first_book.title}<br> by ${summary.first_book.author}<br> 
                    -- <i>Read in ${summary.first_book.month}</i></p>
                </div>
                <div class="book-item">
                    <p class ="subtitle"><b>Last book:</b> <br>
                    ${summary.last_book.title}<br> by ${summary.last_book.author}<br> 
                    -- <i>Read in ${summary.last_book.month}</i></p>
                </div>
                <div class="book-item">
                    <p class ="subtitle"><b>Longest book:</b><br> 
                    ${summary.longest_book.title}<br> by ${summary.longest_book.author}<br> 
                    -- <i>Read in ${summary.longest_book.month}</i></p>
                </div>
                <div class="book-item">
                    <p class ="subtitle"><b>Shortest book:</b> <br>
                    ${summary.shortest_book.title}<br> by ${summary.shortest_book.author}<br> 
                    -- <i>Read in ${summary.shortest_book.month}</i></p>
                </div>
            </div>
        </div>
        <h2>Reading Peaks (and valleys)</h2>
        <div class="summary-stats">
            <div class="summary-card book-grid">
                <div class="book-item">
                    <p><b>Month That You Read The Most Books:</b> ${peaks.reading_peaks.most_books.month} (${peaks.reading_peaks.most_books.count})</p>
                </div>
                <div class="book-item">
                    <p><b>Month That You Read The Most Pages:</b> ${peaks.reading_peaks.most_pages.month} (${peaks.reading_peaks.most_pages.pages})</p>
                </div>
                <div class="book-item">
                    <p><b>Month That You Read The Least Books:</b> ${peaks.reading_peaks.least_books.month} (${peaks.reading_peaks.least_books.count})</p>
                </div>
                <div class="book-item">
                    <p><b>Month That You Read The Least Pages:</b> ${peaks.reading_peaks.least_pages.month} (${peaks.reading_peaks.least_pages.pages})</p>
                </div>
            </div>
        </div>
                <h2 >Your reading year, month by month</h2>
        <div class="month-grid">
            ${monthCards}
        </div>
    </div>
  `;
}


      // function renderReadingPeaks(peaks) {
      //   document.getElementById("slide-peaks").innerHTML = `
      //   <div class="summary-card">
      //     <div class="slide-content">
      //       <h2>Reading Peaks (and valleys)</h2>
      //       <p><b>Month That You Read The Most Books:</b> ${peaks.reading_peaks.most_books.month} (${peaks.reading_peaks.most_books.count})</p>
      //       <p><b>Month That You Read The Most Pages:</b> ${peaks.reading_peaks.most_pages.month} (${peaks.reading_peaks.most_pages.pages})</p>
      //       <p><b>Month That You Read The Least Books:</b> ${peaks.reading_peaks.least_books.month} (${peaks.reading_peaks.least_books.count})</p>
      //       <p><b>Month That You Read The Least Pages:</b> ${peaks.reading_peaks.least_pages.month} (${peaks.reading_peaks.least_pages.pages})</p>
      //     </div>
      //   </div>
      // `;
      // }

      // function renderRatingPeaks(peaks) {
      //   document.getElementById("slide-ratings").innerHTML = `
      //   <div class="summary-card">
      //     <div class="slide-content">
      //       <h2>Rating Peaks (and valleys)</h2>
      //       <p><b>Month With The Most 5 Star Reviews:</b> ${peaks.rating_peaks.most_five_star.month} (${peaks.rating_peaks.most_five_star.five_star_count})</p>
      //       <p><b>Month With The Highest Percentage of 5 Star Reviews:</b> ${peaks.rating_peaks.highest_percentage.month} (${peaks.rating_peaks.highest_percentage.five_star_percentage}%)</p>
      //       </div>
      //       </div>
      //       `;
      // }

      function renderFiveStarBooks(list) {
        const items = list.five_star_books.map(b => `
        <li>${b.title} by ${b.author} (${b.pages} pages) read in ${b.month}</li>
        `).join("");
        document.getElementById("slide-five-stars").innerHTML = `
        <div class="summary-card">
          <div class="slide-content">
            <h2>5 Star Books</h2>
            <ul>
            ${items}
            </ul>
            </div>
            </div>
            `;
      }
      let currentSlide = 0;
      let slides = [];

      function initSlides(startIndex = 0) {
        slides = Array.from(document.querySelectorAll(".slide"));
        slides.forEach(s => s.classList.remove("active"));
        slides[startIndex].classList.add("active");
        currentSlide = startIndex;
      }

      // function showSlide(index) {
      //   if (index < 0 || index >= slides.length) return;

      //   slides[currentSlide].classList.remove("active");
      //   slides[index].classList.add("active");
      //   currentSlide = index;
      // }

      // document.getElementById("nextBtn").addEventListener("click", () => {
      // showSlide(currentSlide + 1);
      // });
      // document.getElementById("reportBtn").addEventListener("click", () => {
      // showSlide(5);
      // });
      // document.getElementById("prevBtn").addEventListener("click", () => {
      // showSlide(currentSlide -1);
      // });
    
      