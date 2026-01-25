def analyze_year(df, year=2025):
    import pandas as pd

    df["Date Read"] = pd.to_datetime(df["Date Read"], errors="coerce").dt.normalize()
    df["Date Added"] = pd.to_datetime(df["Date Added"], errors="coerce").dt.normalize()

    df["Official Date Read"] = df["Date Read"].fillna(df["Date Added"])
    df["Month Name"] = df["Official Date Read"].dt.month_name()

    subset = df[
        [
            "Title",
            "Author",
            "My Rating",
            "Average Rating",
            "Number of Pages",
            "Year Published",
            "Date Read",
            "Date Added",
            "Exclusive Shelf",
            "Read Count",
            "Official Date Read",
            "Month Name",
        ]
    ]

    books_2025 = subset[
        (subset["Exclusive Shelf"] == "read")
        & (
            subset["Date Read"].between("2025-01-01", "2025-12-31")
            | (
                subset["Date Read"].isna()
                & subset["Date Added"].between("2025-01-01", "2025-12-31")
            )
        )
    ]

    months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ]

    monthly = []
    for m in months:
        month_df = books_2025[books_2025["Month Name"] == m]

        books_read = len(month_df)
        pages_read = int(month_df["Number of Pages"].sum())
        five_star_books = len(month_df[month_df["My Rating"] == 5])
        five_star_percentage = (five_star_books / books_read) * 100 if books_read else 0

        monthly.append({
            "month": m,
            "books_read": books_read,
            "pages_read": pages_read,
            "five_star_books": five_star_books,
            "five_star_percentage": round(five_star_percentage, 1)
        })

    # Year stats
    YEARtotalBooks = len(books_2025)
    YEARpagesRead = int(books_2025["Number of Pages"].sum())
    YEARyourAvgRating = books_2025["My Rating"].mean()
    YEARnumFiveStar = len(books_2025[books_2025["My Rating"] == 5])
    YEARpercentFiveStar = (YEARnumFiveStar / YEARtotalBooks) * 100 if YEARtotalBooks else 0


    if YEARtotalBooks:
        minPagesBook = books_2025.loc[books_2025["Number of Pages"].idxmin()]
        maxPagesBook = books_2025.loc[books_2025["Number of Pages"].idxmax()]
        first_book = books_2025.sort_values("Official Date Read").iloc[0]
        last_book = books_2025.sort_values("Official Date Read").iloc[-1]
    else:
        minPagesBook = maxPagesBook = first_book = last_book = None


    most_books = max(monthly, key=lambda x: x["books_read"]) if monthly else None
    least_books = min(monthly, key=lambda x: x["books_read"]) if monthly else None
    most_pages = max(monthly, key=lambda x: x["pages_read"]) if monthly else None
    least_pages = min(monthly, key=lambda x: x["pages_read"]) if monthly else None

    most_five_star = max(monthly, key=lambda x: x["five_star_books"]) if monthly else None

    monthly_with_percent = []
    for m in monthly:
        percent = (m["five_star_books"] / m["books_read"]) * 100 if m["books_read"] else 0
        monthly_with_percent.append({**m, "five_star_percentage": round(percent, 2)})

    highest_percentage = max(monthly, key=lambda x: x["five_star_percentage"]) if monthly else None


    five_star_books_list = books_2025[books_2025["My Rating"] == 5][["Title", "Author", "Number of Pages", "Month Name"]]

    five_star_books = [
    {
        "title": row["Title"],
        "author": row["Author"],
        "pages": int(row["Number of Pages"]),
        "month": row["Month Name"]
    }
    for _, row in books_2025[books_2025["My Rating"] == 5][["Title", "Author", "Number of Pages", "Month Name"]].iterrows()
]



    return {
        "year_summary": {
            "year": year,
            "total_books": YEARtotalBooks,
            "pages_read": YEARpagesRead,
            "avg_rating": round(YEARyourAvgRating, 2) if YEARtotalBooks else 0,
            "num_five_star": YEARnumFiveStar,
            "five_star_percentage": round(YEARpercentFiveStar, 2),

            "shortest_book": {
                "title": minPagesBook["Title"] if minPagesBook is not None else "",
                "author": minPagesBook["Author"] if minPagesBook is not None else "",
                "pages": int(minPagesBook["Number of Pages"]) if minPagesBook is not None else 0,
                "month": minPagesBook["Month Name"] if minPagesBook is not None else "",
            },

            "longest_book": {
                "title": maxPagesBook["Title"] if maxPagesBook is not None else "",
                "author": maxPagesBook["Author"] if maxPagesBook is not None else "",
                "pages": int(maxPagesBook["Number of Pages"]) if maxPagesBook is not None else 0,
                "month": maxPagesBook["Month Name"] if maxPagesBook is not None else "",
            },

            "first_book": {
                "title": first_book["Title"] if first_book is not None else "",
                "author": first_book["Author"] if first_book is not None else "",
                "pages": int(first_book["Number of Pages"]) if first_book is not None else 0,
                "month": first_book["Month Name"] if first_book is not None else "",
            },

            "last_book": {
                "title": last_book["Title"] if last_book is not None else "",
                "author": last_book["Author"] if last_book is not None else "",
                "pages": int(last_book["Number of Pages"]) if last_book is not None else 0,
                "month": last_book["Month Name"] if last_book is not None else "",
            }
        },

        "monthly_stats": monthly,

        "reading_peaks": {
            "most_books": {
                "month": most_books["month"] if most_books else "",
                "count": most_books["books_read"] if most_books else 0
            },
            "most_pages": {
                "month": most_pages["month"] if most_pages else "",
                "pages": most_pages["pages_read"] if most_pages else 0
            },
            "least_books": {
                "month": least_books["month"] if least_books else "",
                "count": least_books["books_read"] if least_books else 0
            },
            "least_pages": {
                "month": least_pages["month"] if least_pages else "",
                "pages": least_pages["pages_read"] if least_pages else 0
            }
        },

        "rating_peaks": {
            "most_five_star": {
                "month": most_five_star["month"] if most_five_star else "",
                "five_star_count": most_five_star["five_star_books"] if most_five_star else 0
            },
            "highest_percentage": {
                "month": highest_percentage["month"] if highest_percentage else "",
                "five_star_percentage": highest_percentage["five_star_percentage"] if highest_percentage else 0
            }
        },
        "five_star_books": five_star_books
    }
