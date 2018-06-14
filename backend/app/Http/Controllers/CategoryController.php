<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Category;

class CategoryController extends Controller
{
    private $category;

    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    public function getCategories()
    {
        $categories = $this->category->all();

        return response()->json([
            'message' => 'Successfully',
            'data' => $categories
        ]);
    }
}
