<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\TimeCapsule;

class RevealCapsules extends Command
{
    protected $signature = 'capsules:reveal';
    protected $description = 'Mark due time capsules as revealed and visible';

    public function handle(): int
    {
        $now = now();

        $capsules = TimeCapsule::where('reveal_date', '<=', $now)
            ->where('revealed', false)
            ->get();

        if ($capsules->isEmpty()) {
            $this->info('No capsules to reveal.');
            return Command::SUCCESS;
        }

        foreach ($capsules as $capsule) {
            $capsule->revealed = true;
            if ($capsule->public) {
                $capsule->visible = true;
            }
            $capsule->save();
        }

        $this->info("Revealed {$capsules->count()} capsule(s).");

        return Command::SUCCESS;
    }
}
